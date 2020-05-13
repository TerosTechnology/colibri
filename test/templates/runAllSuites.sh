# Vunit
export VUNIT_SIMULATOR=ghdl
cd examples/vhdl
python run.py
cd ../..
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
