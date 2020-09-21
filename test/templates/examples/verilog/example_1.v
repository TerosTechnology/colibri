`include "my_incl.vh"
`include "my_inclsv.svh"

module behav_counter( d, clk, clear, load, up_down, qd);

    parameter DATA_WIDTH = 64;
    parameter KEEP_WIDTH = (DATA_WIDTH/8); //!**Data width parameter**
    parameter HDR_WIDTH = 2;

// Port Declaration

input   [7:0] d; //! input 1 comment
input   clk; //!input 2 comment
input   clear; //! input 3 comment
input wire  load;
input wire [7:0] load_b;
input  up_down;
output reg  [7:0] qd;
output reg qd_b;
output reg qd_c = 1;

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
