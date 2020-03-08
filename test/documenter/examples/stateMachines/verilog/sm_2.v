// Copyright 2020
//
// Ismael Perez Rojo (ismaelprojo@gmail.com)
// Carlos Alberto Ruiz Naranjo (carlosruiznaranjo@gmail.com)
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

always@(posedge clk or posedge reset)
begin
  if (reset)
    begin
      state = s1; outp = 1'b1;
    end
  else
    begin
      case (state)
        s1: begin
              if (x1==1'b1) state = s2;
              else          state = s3;
              outp = 1'b1;
            end
        s2: begin
              state = s4; outp = 1'b1;
            end
        s3: begin
              state = s4; outp = 1'b0;
            end
        s4: begin
              state = s1; outp = 1'b0;
            end
      endcase
    end
end
