# -*- coding: utf-8 -*-
import cocotb
from cocotb.triggers import Timer
from cocotb.result import TestFailure
import random

@cocotb.coroutine
def gen_clk(clk, period):
    while True:
        clk.value = 0
        yield Timer(period/2)
        clk.value = 1
        yield Timer(period/2)

@cocotb.test()
def arith_counter_gray_testAlive(dut):
    Period = 10
    clk=dut.clk
    cocotb.fork(gen_clk(clk, Period))
    yield Timer(20*Period)
    rst = random.randint(0, 1)
    inc = random.randint(0, 1)
    dec = random.randint(0, 1)
    dut.rst = rst
    dut.inc = inc
    dut.dec = dec
    yield Timer(20*Period)
    print(dut.val)
    print(dut.cry)
    if int(dut.val) == int(dut.val):
        raise TestFailure(
        "result is incorrect: %s != %s" % str(dut.val))
    else:
        dut._log.info("Ok!")
