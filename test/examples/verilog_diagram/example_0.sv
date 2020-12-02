module module_top #(
           parameter width_byte = 8, /*  param 1 */
           parameter words = 8  /*  param 2 */
       )(
           input clk,
           input rst,
           input [2*width_byte-1:0] i_a,
           input [2*width_byte-1:0] i_b,
           input [2*width_byte-1:0] i_c,
           input  i_rx_0,
           input [3*words-1:0] i_d,
           output o_tx_0,
           output [2*width_byte-1:0] o_a,
           output [2*width_byte+words-1:0] o_b,
           output o_cloks
       );
