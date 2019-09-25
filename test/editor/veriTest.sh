verilator -Wall --cc examples/verilog/uart.v --exe veritest.cpp
make -j -C obj_dir -f Vuart.mk Vuart
./obj_dir/Vuart
