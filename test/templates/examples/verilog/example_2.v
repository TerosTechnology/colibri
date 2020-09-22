module comp#(
           // parameter
           parameter p_size = 12
       )(
           // input
           input clk,
           input rst,
           input [p_size - 1 : 0] i_param,
           input [p_size - 1 : 0] i_param_2,
           input ena,
           // output 
           output reg [2*p_size - 1 : 0] o_param,
           output reg [2*p_size - 1 : 0] o_param_2,
           output reg dv = 0);

endmodule
