`include "vunit_defines.svh"

module comp_tb;

  // Parameters
  localparam  p_size = 12;

  // Ports
  reg clk = 0;
  reg rst = 0;
  reg [p_size - 1 : 0] i_param;
  reg [p_size - 1 : 0] i_param_2;
  reg ena = 0;
  wire [2*p_size - 1 : 0] o_param;
  wire [2*p_size - 1 : 0] o_param_2;
  wire dv;

  comp
    #(
      .p_size (p_size)
    )
  comp_dut (
      .clk (clk),
      .rst (rst),
      .i_param (i_param),
      .i_param_2 (i_param_2),
      .ena (ena),
      .o_param (o_param),
      .o_param_2 (o_param_2),
      .dv (dv)
    );

  `TEST_SUITE begin
    // It is possible to create a basic test bench without any test cases
    $display("Hello world");
  end

  always
    #5  clk =  ! clk;

endmodule