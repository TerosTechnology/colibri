module comp_tb;

  // Parameters
  localparam  p_size = 1;

  // Ports
  reg clk;
  reg rst;
  reg [p_size - 1 : 0] i_param;
  reg [p_size - 1 : 0] i_param_2;
  reg ena;
  reg [2*p_size - 1 : 0] o_param;
  reg [2*p_size - 1 : 0] o_param_2;
  reg  dv;

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

  initial begin
    begin
      $finish;
    end
  end

//   always
//     #5  clk =  ! clk;

endmodule