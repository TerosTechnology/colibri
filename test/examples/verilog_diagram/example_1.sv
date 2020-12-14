
`timescale 1ns / 1ps

module module_abc #(
    parameter bytes = 12,
    parameter bits = 64,
    parameter width = 8,
    parameter outs = 4
  )(
    input clk,
    input rst,
    input rx [outs-1:0],
    input wire [bytes-1:0] regs_out,
    input div_clk,
    output wire [bytes-1:0] process_a [outs-1:0],
    output [width-1:0] process_b [outs-1:0],
    output read [outs-1:0],
    output err_a [outs-1:0],
    output err_b [outs-1:0],
    output div [outs-1:0],
    output wire [bytes-1:0] process_c [outs-1:0],
    output wire err_c [outs-1:0],
    output reg outs_a,
    output reg outs_b
  );
endmodule