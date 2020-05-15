# Vunit
export VUNIT_SIMULATOR=ghdl
cd examples/vhdl/runpy
python run_0.py
python run_1.py
cd ../../..
# Verilator
cd examples/verilog
sh veriTest.sh
cd ../..
# cocotb vhdl
cd examples/vhdl
SIM=ghdl pytest -s
cd ../..
# cocotb verilog
cd examples/verilog
SIM=icarus pytest -s
cd ../..
