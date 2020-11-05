module behav_counter_tb;

  // Parameters
  localparam  DATA_WIDTH = 1;
  localparam  KEEP_WIDTH = 1;
  localparam  HDR_WIDTH = 1;

  // Ports
  reg [7:0] d;
  reg clk;
  reg clear;
  reg load;
  reg [7:0] load_b;
  reg up_down;
  reg [7:0] qd;
  reg qd_b;
  reg qd_c;

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

  initial begin
    begin
      $finish;
    end
  end

//   always
//     #5  clk =  ! clk;

endmodule