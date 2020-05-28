#include <stdlib.h>
#include "Vuart.h"
#include "verilated.h"

int main(int argc, char **argv, char** env) {
  // Initialize Verilators variables
  Verilated::commandArgs(argc, argv);

  // Create an instance of our module under test
  Vuart *tb = new Vuart;

// Tick the clock until we are done//  while(!Verilated::gotFinish()) {
//    tb-> reset = 1;
//    tb-> txclk = 1;
//    tb-> ld_tx_data = 1;
//    tb-> tx_data = 1;
//    tb-> tx_enable = 1;
//    tb-> rxclk = 1;
//    tb-> uld_rx_data = 1;
//    tb-> rx_enable = 1;
//    tb-> rx_in = 1;
//    printf(" Output tx_out: %d \n",tb-> tx_out);
//    printf(" Output tx_empty: %d \n",tb-> tx_empty);
//    printf(" Output rx_data: %d \n",tb-> rx_data);
//    printf(" Output rx_empty: %d \n",tb-> rx_empty);
//    tb->eval();
//  } exit(EXIT_SUCCESS);

    tb-> reset = 1;
    tb-> txclk = 1;
    tb-> ld_tx_data = 1;
    tb-> tx_data = 1;
    tb-> tx_enable = 1;
    tb-> rxclk = 1;
    tb-> uld_rx_data = 1;
    tb-> rx_enable = 1;
    tb-> rx_in = 1;
    tb->eval();
    printf(" Output tx_out: %d \n",tb-> tx_out);
    printf(" Output tx_empty: %d \n",tb-> tx_empty);
    printf(" Output rx_data: %d \n",tb-> rx_data);
    printf(" Output rx_empty: %d \n",tb-> rx_empty);
   exit(EXIT_SUCCESS);
}
