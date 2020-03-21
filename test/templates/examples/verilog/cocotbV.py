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
def uart_testAlive(dut):
    Period = 10
    clk=dut.reset
    cocotb.fork(gen_clk(clk, Period))
    yield Timer(20*Period)
    txclk = random.randint(0, 1)
    ld_tx_data = random.randint(0, 1)
    tx_data = random.randint(0, 1)
    tx_enable = random.randint(0, 1)
    rxclk = random.randint(0, 1)
    uld_rx_data = random.randint(0, 1)
    rx_enable = random.randint(0, 1)
    rx_in = random.randint(0, 1)
    dut.txclk = txclk
    dut.ld_tx_data = ld_tx_data
    dut.tx_data = tx_data
    dut.tx_enable = tx_enable
    dut.rxclk = rxclk
    dut.uld_rx_data = uld_rx_data
    dut.rx_enable = rx_enable
    dut.rx_in = rx_in
    yield Timer(20*Period)
    print(dut.tx_out)
    print(dut.tx_empty)
    print(dut.rx_data)
    print(dut.rx_empty)
    if int(dut.tx_out) == int(dut.tx_out):
        raise TestFailure(
        "result is incorrect: %s != %s" % str(dut.tx_out))
    else:
        dut._log.info("Ok!")
