from cocotb_test.run import run
import pytest
import os

def test_adder_vhdl():
    run(vhdl_sources=["../examples/vhdl/example_1.vhd"],
        simulation_args=["--vcd=func.vcd"],
        toplevel="arith_counter_gray",
        module="cocotb",
        toplevel_lang="vhdl"
    )
