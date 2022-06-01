import { MAX_DISCOUNT_PER_USER_PRODUCT } from './constants'
import { UserType, ProductType } from './types'

/**
 * Calculates the price of a product for a specific user type as per table below.
 *
 * Table shows the final price as percentage of original
 * e.g. For premium user, a 'discount' product will have final price of (fullPrice * (discount/100))
 * +------------+------------+------------+------------+
 * |            |   standard |   discount |       free |
 * +------------+------------+------------+------------+
 * | user       |       100% |    50% (1) |         0% |
 * +------------+------------+------------+------------+
 * | premium    |    50% (2) |        50% |         0% |
 * +------------+------------+------------+------------+
 * | subscriber |         0% |         0% |         0% |
 * +------------+------------+------------+------------+
 *
 * (1) The max discount is $25.
 * (2) The max discount is $40.
 *
 * @param {UserType} userType
 * @param {ProductType} productType
 * @param {number} fullPrice - The full price in dollars of the product without potential discounts
 */
export function getPrice(
  userType: UserType,
  productType: ProductType,
  fullPrice: number
) {
  if (fullPrice < 0) {
    throw Error("fullPrice must be a positive number");
  }

  let finalPrice: number

  switch(userType) {
    case "user":
      finalPrice = getUserPrice(productType, fullPrice)
      break;
    case "premium":
      finalPrice = getPremiumPrice(productType, fullPrice)
      break;
    case "subscriber":
      finalPrice = getSubscriberPrice()
      break;
  }

  finalPrice = applyMax(userType, productType, finalPrice, fullPrice);

  return finalPrice;
}

function getUserPrice(type: ProductType, fullPrice: number): number {
  switch(type) {
    case "standard":
        return fullPrice;
    case "discount":
        return fullPrice * 0.5;
    case "free":
        return 0;
    default:
        return fullPrice;
  }
}

function getPremiumPrice(type: ProductType, fullPrice: number): number {
  switch(type) {
    case "standard":
        return fullPrice * 0.5;
    case "discount":
        return fullPrice * 0.5;
    case "free":
        return 0;
    default:
        return fullPrice;
  }
}

function getSubscriberPrice(): number {
  return 0;
}

// (!) this could live in its own file and then be unit tested separately
function applyMax(userType: UserType, prodType: ProductType, curPrice: number, fullPrice: number): number {
  if (userType === "user" && prodType === "discount") {
    if (curPrice > MAX_DISCOUNT_PER_USER_PRODUCT.USER.DISCOUNT) {
      return fullPrice - MAX_DISCOUNT_PER_USER_PRODUCT.USER.DISCOUNT;
    }
    return curPrice;
  }
  
  if (userType === "premium" && prodType === "standard") {
    if (curPrice > MAX_DISCOUNT_PER_USER_PRODUCT.PREMIUM.STANDARD) {
      return fullPrice - MAX_DISCOUNT_PER_USER_PRODUCT.PREMIUM.STANDARD;
    }
    return curPrice;
  }

  return curPrice
}