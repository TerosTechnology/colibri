`include "my_incl.vh"
`include "my_inclsv.svh"

module behav_counter( d, clk, clear, load, up_down, qd);

  // Port Declaration

  input   [7:0] d; //! input 1 comment
  input   clk; //!input 2 comment
  input   clear; //! input 3 comment
  input   load;
  input   up_down;
  output  [7:0] qd;

  reg     [7:0] cnt;

  always @ (posedge clk)
  begin
    if (!clear)
      cnt <= 8'h00;
    else if (load)
      cnt <= d;
    else if (up_down)
      cnt <= cnt + 1;
    else
      cnt <= cnt - 1;
  end

  assign qd = cnt;

endmodule
