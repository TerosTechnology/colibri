# -*- coding: utf-8 -*-
import cocotb
from cocotb.clock import Clock
from cocotb.triggers import Timer
from cocotb.regression import TestFactory


@cocotb.test()
async def run_test(dut):
    PERIOD = 10

    dut.reset = 0
    dut.txclk = 0
    dut.ld_tx_data = 0
    dut.tx_data = 0
    dut.tx_enable = 0
    dut.rxclk = 0
    dut.uld_rx_data = 0
    dut.rx_enable = 0
    dut.rx_in = 0
    dut.tx_out = 0
    dut.tx_empty = 0
    dut.rx_data = 0
    dut.rx_empty = 0

    await Timer(20*PERIOD, units='ns')

    dut.reset = 1
    dut.txclk = 1
    dut.ld_tx_data = 1
    dut.tx_data = 1
    dut.tx_enable = 1
    dut.rxclk = 1
    dut.uld_rx_data = 1
    dut.rx_enable = 1
    dut.rx_in = 1
    dut.tx_out = 1
    dut.tx_empty = 1
    dut.rx_data = 1
    dut.rx_empty = 1

    await Timer(20*PERIOD, units='ns')

# Register the test.
factory = TestFactory(run_test)
factory.generate_tests()
