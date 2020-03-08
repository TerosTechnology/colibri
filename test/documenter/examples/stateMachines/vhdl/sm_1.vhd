-- Copyright 2020
--
-- Ismael Perez Rojo (ismaelprojo@gmail.com)
-- Carlos Alberto Ruiz Naranjo (carlosruiznaranjo@gmail.com)
--
-- This file is part of Colibri.
--
-- Colibri is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- Colibri is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with Colibri.  If not, see <https://www.gnu.org/licenses/>.

p_comb : process(
                 r_st_present    ,
                 i_input1        ,
                 i_input2        )
begin
  case r_st_present is
    when ST_S1 =>
      if (i_input1='1') then
        w_st_next  <= ST_S2;
      else
        w_st_next  <= ST_S1; --hola
      end if;
    when ST_S2 =>
      if (i_input1='0') and (i_input2='1')then
        w_st_next  <= ST_S3;
      elsif (asdfasd) then
        w_st_next  <= ST_S3;
      else
        w_st_next  <= ST_S2;
      end if;
    when ST_S3 =>
      w_st_next  <= ST_S1;
    when others=> -- ST_S3 =>
      w_st_next  <= ST_S1;
  end case;
end process p_comb;
