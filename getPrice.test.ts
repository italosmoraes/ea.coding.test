import { getPrice } from "./getPrice";
import { ProductType, UserType } from "./types";

describe("getPrice", () => {

  // -- Descriptive tests. Also initially used to help make sense of the getPrice logic
  // (!) could be deleted before PR submission

  it("returns discount price for user", () => {
    const price = getPrice("user", "discount", 10);

    expect(price).toBe(5);
  })
  it("returns free price for user", () => {
    const price = getPrice("user", "free", 10);

    expect(price).toBe(0);
  })
  it("returns standard price for user", () => {
    const price = getPrice("user", "standard", 10);

    expect(price).toBe(10);
  })
  
  it("returns standard price for premium user", () => {
    const price = getPrice("premium", "standard", 10);

    expect(price).toBe(5);
  })
  it("returns discount price for premium user", () => {
    const price = getPrice("premium", "discount", 10);

    expect(price).toBe(5);
  })
  it("returns free price for premium user", () => {
    const price = getPrice("premium", "free", 10);

    expect(price).toBe(0);
  })

  it("returns standard price for subscriber", () => {
    const price = getPrice("subscriber", "standard", 10);

    expect(price).toBe(0);
  })
  it("returns discount price for subscriber", () => {
    const price = getPrice("subscriber", "discount", 10);

    expect(price).toBe(0);
  })
  it("returns free price for subscriber", () => {
    const price = getPrice("subscriber", "free", 10);

    expect(price).toBe(0);
  })

  it("applies max discount for 'discount' price for user", () => {
    const price = getPrice("user", "discount", 100);

    expect(price).toBe(75);
  })

  it("does not apply max discount for 'discount' price for premium user", () => {
    const price = getPrice("premium", "discount", 100);

    expect(price).toBe(50);
  })

  it("applies max discount for 'standard' price for premium user", () => {
    const price = getPrice("premium", "standard", 100);

    expect(price).toBe(60);
  })

  // -- Special case

  it("handles negative prices", () => {
    expect(function() { getPrice("premium", "standard", -100); }).toThrowError("fullPrice must be a positive number");
  })

  // -- Cleaned up way to test the discount table

  it("returns correct prices", () => {
    const testCases: Array<{
      userType: UserType, prodType: ProductType, price: number, finalPrice: number
    }> = [
      {userType: "user", prodType: "standard", price: 100, finalPrice: 100},
      {userType: "user", prodType: "discount", price: 100, finalPrice: 75},
      {userType: "user", prodType: "free", price: 100, finalPrice: 0},
      {userType: "premium", prodType: "standard", price: 100, finalPrice: 60},
      {userType: "premium", prodType: "discount", price: 100, finalPrice: 50},
      {userType: "premium", prodType: "free", price: 100, finalPrice: 0},
      {userType: "subscriber", prodType: "standard", price: 100, finalPrice: 0},
      {userType: "subscriber", prodType: "discount", price: 100, finalPrice: 0},
      {userType: "subscriber", prodType: "free", price: 100, finalPrice: 0}
    ]

    testCases.forEach(test => {
      expect(getPrice(test.userType, test.prodType, test.price)).toEqual(test.finalPrice)
    })
  })
});
