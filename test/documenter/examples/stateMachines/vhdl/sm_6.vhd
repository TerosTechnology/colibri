-- Copyright 2020 Teros Tech
--
-- Ismael Perez Rojo
-- Carlos Alberto Ruiz Naranjo
-- Alfredo Enrique Sáez
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


-- Determine what the next state will be, and set the output bits
process (present_state, updown)
begin
  case present_state is
    when zero =>
      if (updown = '0') then
        next_state <= one;
        lsb <= '0';
        msb <= '0';
      else
        next_state <= three;
        lsb <= '1';
        msb <= '1';
      end if;
    when one =>
      if (updown = '0') then
        next_state <= two;
        lsb <= '1';
        msb <= '0';
      else
        next_state <= zero;
        lsb <= '0';
        msb <= '0';
      end if;
    when two =>
      if (updown = '0') then
        next_state <= three;
        lsb <= '0';
        msb <= '1';
      else
        next_state <= one;
        lsb <= '1';
        msb <= '0';
      end if;
    when three =>
      if (updown = '0') then
        next_state := zero;
        lsb <= '1';
        msb <= '1';
      else
        next_state := two;
        lsb <= '0';
        msb <= '1';
      end if;
  end case;
end process;
