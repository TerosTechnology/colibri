# -*- coding: utf-8 -*-
import cocotb
from cocotb.clock import Clock
from cocotb.triggers import Timer
from cocotb.regression import TestFactory


@cocotb.test()
async def run_test(dut):
    PERIOD = 10
    cocotb.fork(Clock(dut.clk, PERIOD, 'ns').start(start_high=False))

    dut.rst = 0
    dut.inc = 0
    dut.dec = 0
    dut.val = 0
    dut.cry = 0

    await Timer(20*PERIOD, units='ns')

    dut.rst = 1
    dut.inc = 1
    dut.dec = 1
    dut.val = 1
    dut.cry = 1

    await Timer(20*PERIOD, units='ns')

# Register the test.
factory = TestFactory(run_test)
factory.generate_tests()
