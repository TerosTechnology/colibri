`include "vunit_defines.svh"

module uart_tb;

  // Parameters

  // Ports
  reg  reset = 0;
  reg  txclk = 0;
  reg  ld_tx_data = 0;
  reg  [7:0] tx_data;
  reg  tx_enable = 0;
  reg  rxclk = 0;
  reg  uld_rx_data = 0;
  reg  rx_enable = 0;
  reg  rx_in = 0;
  wire tx_out;
  wire tx_empty;
  wire [7:0] rx_data;
  wire rx_empty;

  uart
  uart_dut (
      .reset (reset),
      .txclk (txclk),
      .ld_tx_data (ld_tx_data),
      .tx_data (tx_data),
      .tx_enable (tx_enable),
      .rxclk (rxclk),
      .uld_rx_data (uld_rx_data),
      .rx_enable (rx_enable),
      .rx_in (rx_in),
      .tx_out (tx_out),
      .tx_empty (tx_empty),
      .rx_data (rx_data),
      .rx_empty (rx_empty)
    );

  `TEST_SUITE begin
    // It is possible to create a basic test bench without any test cases
    $display("Hello world");
  end

  always
    #5  txclk =  ! txclk;
  always
    #5  rxclk =  ! rxclk;

endmodule
