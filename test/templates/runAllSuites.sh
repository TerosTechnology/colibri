# Vunit
export VUNIT_SIMULATOR=ghdl
cd examples/vhdl/runpy
python3 run_0.py
python3 run_1.py
python3 run_2.py
python3 run_3.py
python3 run_4.py
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
# Remove folders
rm ./examples/vhdl/runpy/*gcda
rm ./examples/vhdl/runpy/*gcno
rm -r ./examples/vhdl/runpy/coverage
rm -r ./examples/vhdl/runpy/vunit_out
rm ./examples/vhdl/runpy/*info
rm -r ./examples/verilog/obj_dir