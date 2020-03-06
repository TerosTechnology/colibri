# Simple tests for an adder module
import random

import cocotb
from cocotb.result import TestFailure
from cocotb.triggers import Timer


def adder_model(a, b):
    """ model of adder """
    return a + b


@cocotb.coroutine
def gen_clk(clk, period):
    while True:
        clk.value = 0
        yield Timer(period / 2)
        clk.value = 1
        yield Timer(period / 2)


@cocotb.test()
def adder_basic_test(dut):
    PERIOD = 10
    clk = dut.clk
    cocotb.fork(gen_clk(clk, PERIOD))

    """Test for 5 + 10"""
    yield Timer(20 * PERIOD)
    A = 5
    B = 10

    dut.A = A
    dut.B = B

    yield Timer(20 * PERIOD)
    # print(dut.test)

    if int(dut.X) != adder_model(A, B):
        raise TestFailure(
            "Adder result is incorrect: %s != 15" % str(dut.X))
    else:  # these last two lines are not strictly necessary
        dut._log.info("Ok!")


@cocotb.test()
def adder_basic2_test(dut):
    PERIOD = 10
    clk = dut.clk
    cocotb.fork(gen_clk(clk, PERIOD))

    """Test for 5 + 10"""
    yield Timer(20 * PERIOD)
    A = 7
    B = 7

    dut.A = A
    dut.B = B

    yield Timer(20 * PERIOD)
    # print(dut.test)

    if int(dut.X) != adder_model(A, B):
        raise TestFailure(
            "Adder result is incorrect: %s != 14" % str(dut.X))
    else:  # these last two lines are not strictly necessary
        dut._log.info("Ok!")


@cocotb.test()
def adder_random_test(dut):
    PERIOD = 10
    clk = dut.clk
    cocotb.fork(gen_clk(clk, PERIOD))

    """Test for adding 2 random numbers multiple times"""
    yield Timer(20 * PERIOD)

    for i in range(10):
        A = random.randint(0, 5)
        B = random.randint(0, 5)
        dut.A = A
        dut.B = B

        yield Timer(20 * PERIOD)

        if int(dut.X) != adder_model(A, B):
            raise TestFailure(
                "Randomised test failed with: %s + %s = %s" %
                (int(dut.A), int(dut.B), int(dut.X)))
        else:  # these last two lines are not strictly necessary
            dut._log.info("Ok!")
