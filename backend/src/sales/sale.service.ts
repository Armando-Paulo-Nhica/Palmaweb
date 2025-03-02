import {db} from '../utiles/db.server'
import { Prisma } from '@prisma/client';
import { updateProductQty } from '../products/product.service';
import { Decimal } from 'decimal.js';
import { error } from 'pdf-lib';
type Sale = {
    totalAmount: number,
    customerId: number, 
    employerId: number,
    invoice: number, 
    items: [
      { productId: number, quantity: number, subTotal: number }
      
    ],
  };

// Invoice
function generateInvoice() {
  const currentTime = new Date().getTime();
  const reference = currentTime.toString().slice(-10);
  return parseInt(reference, 10);
} 

//   Get all sale
export async function findAll(){
	const sale = await db.sale.findMany(
            {
              orderBy: {id: 'desc'},
                select: {id: true, customer:true, invoice: true, employer: true, totalAmount: true, createdAt: true, items: {select: {quantity: true, subTotal: true, product: true}}}
            }
        )
	return sale;
}

//   Get employer sales
export async function findMine(employerId: number){
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); 
	const sale = await db.sale.count({where:{
    employerId: employerId, // Filter sales by employerId
          createdAt: {
              gte: startDate,
              lt: endDate
          }
  }})
	return sale;
}

// Retrive today sales
export async function findTodaySales(employerId: number) {
  // Get today's date
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Start of tomorrow

  const sales = await db.sale.count({
      where: {
          employerId: employerId, // Filter sales by employerId
          createdAt: {
              gte: startDate,
              lt: endDate
          }
      }
  });

  return sales;
}
 

export async function sumTodaySales() {
  // Get today's date
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Start of tomorrow

  // Consulta para somar totalAmount das vendas de hoje
  const totalAmount = db.sale.aggregate({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate
      }
    },
    _sum: {
      totalAmount: true
    }
  });

  // A variável 'totalAmount' agora contém o valor total das vendas de hoje
  return (await totalAmount)._sum.totalAmount;
}




export async function sumMySales(id: number) {
  // Get today's date
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Start of tomorrow

  // Consulta para somar totalAmount das vendas de hoje
  const totalAmount = db.sale.aggregate({
    where: {
      employerId: id,
      createdAt: {
        gte: startDate,
        lt: endDate
      }
    },
    _sum: {
      totalAmount: true
    }
  });

  // A variável 'totalAmount' agora contém o valor total das vendas de hoje
  return (await totalAmount)._sum.totalAmount;
}


export async function getCostOfmySales(id: number) {
  // Get today's date
  var cost = 0;
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Start of tomorrow
    // Consulta para obter todas as vendas
    const sales = await db.sale.findMany({
      where: {
        employerId: id,
        createdAt: {
          gte: startDate,
          lt: endDate
        }
      },
      select: {items: {select: {quantity: true, product: {select: {shop: true}}}}}
    });
  
    sales.forEach(item =>{
      item.items.forEach(elem =>{
        cost += elem.quantity * elem.product.shop.toNumber();
      })
    })
  
    return cost;
  }


export async function getCost() {
// Get today's date
var cost = 0;
const today = new Date();
const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1); // Start of tomorrow
  // Consulta para obter todas as vendas
  const sales = await db.sale.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate
      }
    },
    select: {items: {select: {quantity: true, product: {select: {shop: true}}}}}
  });

  sales.forEach(item =>{
    item.items.forEach(elem =>{
      cost += elem.quantity * elem.product.shop.toNumber();
    })
  })

  return cost;
}


// Get sales of last 5 months
export async function getSalesOf5months() {
  try {
      // Get the current date
      const currentDate = new Date();
      // Calculate the start date 5 months ago
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);
      // Calculate the end date (today)
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth()  + 1, 1);

      // Query the database to sum totalAmount grouped by month
      const salesByMonth = await db.sale.groupBy({
        by: 'dateIn',
        _sum: {
          totalAmount: true
        },
        orderBy: {dateIn: 'asc'},
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      });
      
      return salesByMonth;
  } catch (error) {
      throw error;
  }
}


// Get sales of last 5 months
export async function getMySalesOf5months(id: number) {
  try {
      // Get the current date
      const currentDate = new Date();
      // Calculate the start date 5 months ago
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);
      // Calculate the end date (today)
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth()  + 1, 1);

      // Query the database to sum totalAmount grouped by month
      const salesByMonth = await db.sale.groupBy({
        by: 'dateIn',
        _sum: {
          totalAmount: true
        },
        orderBy: {dateIn: 'asc'},
        where: {
          employerId: id,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      });
      
      return salesByMonth;
  } catch (error) {
      throw error;
  }
}


// Get cost of last 5 months
export async function getCostOfLast5months() {
  var cost = 0;
  const currentDate = new Date();
  // Calculate the start date 5 months ago
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);
  // Calculate the end date (today)
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Consulta para obter todas as vendas
    const sales = await db.sale.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate
        }
      },
      orderBy: {dateIn: 'asc'},
      select: {dateIn: true, items: {select: {quantity: true, product: {select: {shop: true}}}}}
    });
  
    return sales;
}


export async function getMyCostOfLast5months(id: number) {
  var cost = 0;
  const currentDate = new Date();
  // Calculate the start date 5 months ago
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);
  // Calculate the end date (today)
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Consulta para obter todas as vendas
    const sales = await db.sale.findMany({
      where: {
        employerId: id,
        createdAt: {
          gte: startDate,
          lt: endDate
        }
      },
      orderBy: {dateIn: 'asc'},
      select: {dateIn: true, items: {select: {quantity: true, product: {select: {shop: true}}}}}
    });
  
    return sales;
}



export async function topSoldProducts(interval: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let startDate;
  let endDate;

  switch (interval) {
    case 'daily':
      startDate = today;
      endDate = new Date(today.getTime() + 24 * 60 * 60 * 1000); // Next day
      break;
    case 'weekly':
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()); // Start of current week (Sunday)
      endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // End of current week (next Sunday)
      break;
    case 'monthly':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1); // Start of current month
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End of current month
      break;
    default:
      throw new Error('Invalid interval provided');
  }

  const topSoldProducts = await db.saleOrder.groupBy({
    by: ['productId'],
    _sum: {
      quantity: true
    },
    where: {
      sale: {
        createdAt: {
          gte: startDate,
          lt: endDate
        }
      }
    },
    orderBy: {
      _sum: {
        quantity: 'desc'
      }
    },
    take: 3
  });

  
  const top3Products = await Promise.all(
    topSoldProducts.map(async sale => {
      try {
        const products = await db.product.findUnique({
          where: { id: sale.productId },
          select: { name: true }
        });

        return {
          productId: sale.productId,
          name: products?.name,
          total: sale._sum.quantity
        };
      } catch (error) {
        throw error;
      }
    })
  );


return top3Products;
}






// Get single sale
export async function findById(id: number){
	const sale = await db.sale.findUnique({where: {id: id},  select: {id: true, invoice: true, customerId:true, employerId:true, totalAmount: true, createdAt: true, items: {select: {quantity: true, subTotal: true, product: true}}}})
	return sale;
}

// Create sale
export async function create(newSaleData: Sale){
  
const isUpdated = await updateProductQty(newSaleData.items);
const currentDate = new Date();
// Get the year and month separately
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // January is 0, so we add 1 to get the correct month number
// Format the date as a string in the 'YYYY-MM' format
const formattedDate = `${year}-${month.toString().padStart(2, '0')}`;

	if(isUpdated){
      const Sale = await db.sale.create({
        data: {
            totalAmount: newSaleData.totalAmount,
            customerId: newSaleData.customerId,
            employerId: newSaleData.employerId,
            dateIn: formattedDate,
            invoice: generateInvoice(),
            items:{create: newSaleData.items}
            }})
      return Sale;
  }

}
// Delete Sale
export async function destroy(id: number){
	const sale = await db.sale.delete({where: {id: id}})
	return sale;
}

// Update sale
export async function updateSale(id: number, newSaleData: Sale) {
  try {
    const sale = await db.sale.update({
      where: { id: id },
      data: {
        totalAmount: newSaleData.totalAmount,
        customerId: newSaleData.customerId,
        employerId: newSaleData.employerId,
        items: { 
          // Assuming SaleOrder data is directly provided in newSaleData.items
          upsert: newSaleData.items.map(item => ({
            where: { saleId_productId: { saleId: id, productId: item.productId } },
            update: {
              quantity: item.quantity,
              subTotal: item.subTotal,
            },
            create: {
              quantity: item.quantity,
              subTotal: item.subTotal,
              productId: item.productId,
            },
          })),
        },
      },
    });

    return sale;
  } catch (error) {
    throw error;
  }
}
