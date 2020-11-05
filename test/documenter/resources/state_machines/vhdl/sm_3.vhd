-- Copyright 2020 Teros Technology
--
-- Ismael Perez Rojo
-- Carlos Alberto Ruiz Naranjo
-- Alfredo Saez
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

process(stateMoore_reg, level)
begin
    -- store current state as next
    stateMoore_next <= stateMoore_reg; -- required: when no case statement is satisfied

    Moore_tick <= '0'; -- set tick to zero (so that 'tick = 1' is available for 1 cycle only)
    case stateMoore_reg is
        when zero => -- if state is zero,
            if level = '1' then  -- and level is 1
                stateMoore_next <= edge; -- then go to state edge.
            end if;
        when edge =>
            Moore_tick <= '1'; -- set the tick to 1.
            if level = '1' then -- if level is 1,
                stateMoore_next <= one; --go to state one,
            else
                stateMoore_next <= zero; -- else go to state zero.
            end if;
        when one =>
            if level = '0' then -- if level is 0,
                stateMoore_next <= zero; -- then go to state zero.
            end if;
    end case;
end process;
