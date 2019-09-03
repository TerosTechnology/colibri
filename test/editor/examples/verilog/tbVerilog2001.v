module uart_tb;

  // Parameters
  localparam  g_PARAMETER_0;

  // Ports
  reg  reset;
  reg  txclk;
  reg  ld_tx_data;
  reg [7:0] tx_data;
  reg  tx_enable;
  reg  tx_out;
  reg  tx_empty;
  reg  rxclk;
  reg  uld_rx_data;
  reg [7:0] rx_data;
  reg  rx_enable;
  reg  rx_in;
  reg  rx_empty;

  uart
    #(
      .g_PARAMETER_0 (g_PARAMETER_0)
    )
  uart_dut (
      .reset (reset),
      .txclk (txclk),
      .ld_tx_data (ld_tx_data),
      .tx_data (tx_data),
      .tx_enable (tx_enable),
      .tx_out (tx_out),
      .tx_empty (tx_empty),
      .rxclk (rxclk),
      .uld_rx_data (uld_rx_data),
      .rx_data (rx_data),
      .rx_enable (rx_enable),
      .rx_in (rx_in),
      .rx_empty (rx_empty)
    );

  initial begin
  begin
    $finish;
  end

//   always
//     #5  clk =  ! clk;

endmodule
