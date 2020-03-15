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

process(stateMealy_reg, level)
begin
    -- store current state as next
    stateMealy_next <= stateMealy_reg; --required: when no case statement is satisfied

    Mealy_tick <= '0';  -- set tick to zero (so that 'tick = 1' is available for 1 cycle only)
    case stateMealy_reg is
        when zero =>  -- set 'tick = 1' if state = zero and level = '1'
            if level = '1' then -- if level is 1, then go to state one,
                stateMealy_next <= one; -- otherwise remain in same state.
                Mealy_tick <= '1';
            end if;
        when one =>
            if level = '0' then  -- if level is 0, then go to zero state,
                stateMealy_next <= zero; -- otherwise remain in one state.
            end if;
    end case;
end process;
