import { describe, expect, it } from "vitest";
import { TestDriver } from "testdriverai/vitest/hooks";

const APP_URL = process.env.APP_URL || "http://localhost:5173";

describe("Gelato Cart", () => {
  it("shows an empty cart initially and adds a flavour", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({ url: APP_URL });

    // Verify initial empty cart state
    let assertResult = await testdriver.assert("the cart says 'Your cart is empty.'");
    expect(assertResult).toBeTruthy();

    // Add Pistachio flavour to cart
    const addPistachio = await testdriver.find("Add Pistachio button");
    await addPistachio.click();

    // Verify Pistachio is added to cart with price $4.50
    assertResult = await testdriver.assert(
      "Pistachio is listed in Your cart with quantity 1 and Total is $4.50"
    );
    expect(assertResult).toBeTruthy();
  });

  it("updates quantity and recalculates total in the cart", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({ url: APP_URL });

    // Add Pistachio flavour to cart
    const addPistachio = await testdriver.find("Add Pistachio button");
    await addPistachio.click();

    // Increase quantity to 2
    const increaseBtn = await testdriver.find("Increase Pistachio button");
    await increaseBtn.click();

    // Total should update to $9.00 ($4.50 * 2)
    let assertResult = await testdriver.assert(
      "Pistachio quantity is 2 and Total is $9.00"
    );
    expect(assertResult).toBeTruthy();

    // Decrease quantity back to 1
    const decreaseBtn = await testdriver.find("Decrease Pistachio button");
    await decreaseBtn.click();

    assertResult = await testdriver.assert(
      "Pistachio quantity is 1 and Total is $4.50"
    );
    expect(assertResult).toBeTruthy();
  });
});
