//! @file example_8.vhd
//! @author el3ctrician (elbadriahmad@gmail.com)
//! @brief Some description can be added here
//! also in multi-lines
//! @details Another description can be added here
//! @version 0.1
//! @date 2020-07-10
//!
//! @copyright  Copyright (c) 2021 by TerosHDL
//!              GNU Public License
//!  This program is free software: you can redistribute it and/or modify
//!  it under the terms of the GNU General Public License as published by
//!  the Free Software Foundation, either version 3 of the License, or
//!  (at your option) any later version.
//!  This program is distributed in the hope that it will be useful,
//!  but WITHOUT ANY WARRANTY; without even the implied warranty of
//!  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//!  GNU General Public License for more details.
//!  You should have received a copy of the GNU General Public License
//!  along with this program.  If not, see <https://www.gnu.org/licenses/>
//!
//! And more core description can be added here
module add2_and_clip_reg
  #(parameter WIDTH=16) //! pepe
    (input clk,
     input rst,
     input [WIDTH-1:0] in1, //!**descrition**
     input [WIDTH-1:0] in2,
     input strobe_in,
     output reg [WIDTH-1:0] sum,
     output reg strobe_out);

   wire [WIDTH-1:0] sum_int;

   add2_and_clip #(.WIDTH(WIDTH)) add2_and_clip (.in1(in1),.in2(in2),.sum(sum_int));

   always @(posedge clk)
     if(rst)
       sum <= 0;
     else if(strobe_in)
       sum <= sum_int;

   always @(posedge clk) strobe_out <= rst ? 1'b0 : strobe_in;

endmodule // add2_and_clip_reg
