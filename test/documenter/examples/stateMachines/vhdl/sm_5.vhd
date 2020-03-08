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

process (clk, reset)
begin
  if reset = '1' then
    state <= s0;
  elsif (rising_edge(clk)) then
    -- Determine the next state synchronously, based on
    -- the current state and the input
    case state is
      when s0=>
        if data_in = '1' then
          state <= s1;
        else
          state <= s0;
        end if;
      when s1=>
        if data_in = '1' then
          state <= s2;
        else
          state <= s1;
        end if;
      when s2=>
        if data_in = '1' then
          state <= s3;
        else
          state <= s2;
        end if;
      when s3=>
        if data_in = '1' then
          state <= s3;
        else
          state <= s1;
        end if;
    end case;

  end if;
end process;
