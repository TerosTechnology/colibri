`include "vunit_defines.svh"

module behav_counter_tb;

  // Parameters
  localparam  DATA_WIDTH = 64;
  localparam  KEEP_WIDTH = undefined;
  localparam  HDR_WIDTH = 2;

  // Ports
  reg [7:0] d;
  reg clk = 0;
  reg clear = 0;
  reg load = 0;
  reg [7:0] load_b;
  reg up_down = 0;
  wire [7:0] qd;
  wire qd_b;
  wire qd_c;

  behav_counter
    #(
      .DATA_WIDTH(DATA_WIDTH),
      .KEEP_WIDTH(KEEP_WIDTH),
      .HDR_WIDTH (HDR_WIDTH)
    )
  behav_counter_dut (
      .d (d),
      .clk (clk),
      .clear (clear),
      .load (load),
      .load_b (load_b),
      .up_down (up_down),
      .qd (qd),
      .qd_b (qd_b),
      .qd_c (qd_c)
    );

  `TEST_SUITE begin
    // It is possible to create a basic test bench without any test cases
    $display("Hello world");
  end

  always
    #5  clk =  ! clk;

endmodule