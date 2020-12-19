/*
Copyright (c) 2019 Alex Forencich
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// Language: Verilog 2001

`timescale 1ns / 1ps

/*
 * AXI4-Stream 10GBASE-R frame transmitter (AXI in, 10GBASE-R out)
 */
module axis_baser_tx_64 #
  (
    parameter DATA_WIDTH = 64,
    parameter KEEP_WIDTH = (DATA_WIDTH/8), //!**Data width parameter**
    parameter HDR_WIDTH = 2,
    parameter ENABLE_PADDING = 1,
    parameter ENABLE_DIC = 1,     //!enable
    parameter MIN_FRAME_LENGTH = 64
  )
  (
    input  wire                  clk,
    input  wire                  rst,

    /*
     * AXI input
     */
    input  wire [2*DATA_WIDTH-1:0] s_axis_tdata,
    input  wire [2*KEEP_WIDTH-1:0] s_axis_tkeep,
    input  wire                  s_axis_tvalid,
    output wire                  s_axis_tready,
    input  wire                  s_axis_tlast,
    input  wire                  s_axis_tuser,

    /*
     * 10GBASE-R encoded interface
     */
    output wire [2*DATA_WIDTH-1:0] encoded_tx_data,
    output wire [2*HDR_WIDTH-1:0]  encoded_tx_hdr,

    /*
     * Configuration
     */
    input  wire [7:0]            ifg_delay,

    /*
     * Status
     */
    output wire                  start_packet_0,
    output wire                  start_packet_4,
    output wire                  error_underflow
  );

  localparam  my_local_param = 10, my_local_param1 = 15; //! local param 1 & 2
  localparam  integer my_local_param2 =20; //!local param 3
  wire a, b, c; //! coment abc
  wire [3:0] ddd; //!coment ddd 
  reg aa,bb; //! comment ee
  reg [4:0] cc; //! comment ee
  logic [3:0] fff; //! comment fff
  my_type_t t1, t2;   //! my_type vars

  function int foo(string bar, type1 baz); //! function 1
  endfunction

endmodule
