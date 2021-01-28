// Copyright 2020 Teros Technology
//
// Ismael Perez Rojo
// Carlos Alberto Ruiz Naranjo
// Alfredo Saez
//
// This file is part of Colibri.
//
// Colibri is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Colibri is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Colibri.  If not, see <https://www.gnu.org/licenses/>.
module fsm0 (
  input clock,
  input reset,
  output gnt_0,gnt_1,
  input req_0,req_1
);

typedef enum {IDLE, GNT0, GNT1} state_t;
state_t state = idle;

always @ (posedge clock)
begin : FSM
if (reset == 1'b1) begin
  state <= #1 IDLE;
  gnt_0 <= 0;
  gnt_1 <= 0;
end else
 case(state)
   IDLE : if (req_0 == 1'b1) begin
                state <= #1 GNT0;
                gnt_0 <= 1;
              end else if (req_1 == 1'b1) begin
                gnt_1 <= 1;
                state <= #1 GNT1;
              end else begin
                state <= #1 IDLE; //example comment
              end
   GNT0 : if (req_0 == 1'b1) begin
                state <= #1 GNT0;
              end else begin
                gnt_0 <= 0;
                state <= #1 IDLE;
              end
   GNT1 : if (req_1 == 1'b1) begin
                state <= #1 GNT1;
              end else begin
                gnt_1 <= 0;
                state <= #1 IDLE;
              end
   default : state <= #1 IDLE;
endcase
end
endmodule
