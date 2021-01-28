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
entity sm_0 is
    port (
        Clk   : in std_logic;
        nRst : in std_logic
        
    );
end entity;
architecture rtl of sm_0 is

begin

process(Clk) is
begin
    if rising_edge(Clk) then
        if nRst = '0' then
            -- Reset values
            State   <= NorthNext;
            Counter <= 0;
            NorthRed    <= '1';
            NorthYellow <= '0';
            NorthGreen  <= '0';
            WestRed     <= '1';
            WestYellow  <= '0';
            WestGreen   <= '0';

        else
            -- Default values
            NorthRed    <= '0';
            NorthYellow <= '0';
            NorthGreen  <= '0';
            WestRed     <= '0';
            WestYellow  <= '0';
            WestGreen   <= '0';

            Counter <= Counter + 1;

            case State is

                -- Red in all directions
                when NorthNext =>
                    NorthRed <= '1';
                    WestRed  <= '1';
                    -- If 5 seconds have passed
                    if Counter = ClockFrequencyHz * 5 -1 then
                        Counter <= 0;
                        State   <= StartNorth;
                    end if;

                -- Red and yellow in north/south direction
                when StartNorth =>
                    NorthRed    <= '1';
                    NorthYellow <= '1';
                    WestRed     <= '1';
                    -- If 5 seconds have passed
                    if Counter = ClockFrequencyHz * 5 -1 then
                        Counter <= 0;
                        State   <= North;
                    end if;

                -- Green in north/south direction
                when North =>
                    NorthGreen <= '1';
                    WestRed    <= '1';
                    -- If 1 minute has passed
                    if Counter = ClockFrequencyHz * 60 -1 then
                        Counter <= 0;
                        State   <= StopNorth;
                    end if;

                -- Yellow in north/south direction
                when StopNorth =>
                    NorthYellow <= '1';
                    WestRed     <= '1';
                    -- If 5 seconds have passed
                    if Counter = ClockFrequencyHz * 5 -1 then
                        Counter <= 0;
                        State   <= WestNext;
                    end if;

                -- Red in all directions
                when WestNext =>
                    NorthRed <= '1';
                    WestRed  <= '1';
                    -- If 5 seconds have passed
                    if Counter = ClockFrequencyHz * 5 -1 then
                        Counter <= 0;
                        State   <= StartWest;
                    end if;

                -- Red and yellow in west/east direction
                when StartWest =>
                    NorthRed   <= '1';
                    WestRed    <= '1';
                    WestYellow <= '1';
                    -- If 5 seconds have passed
                    if Counter = ClockFrequencyHz * 5 -1 then
                        Counter <= 0;
                        State   <= West;
                    end if;

                -- Green in west/east direction
                when West =>
                    NorthRed  <= '1';
                    WestGreen <= '1';
                    -- If 1 minute has passed
                    if Counter = ClockFrequencyHz * 60 -1 then
                        Counter <= 0;
                        State   <= StopWest;
                    end if;

                -- Yellow in west/east direction
                when StopWest =>
                    NorthRed   <= '1';
                    WestYellow <= '1';
                    -- If 5 seconds have passed
                    if Counter = ClockFrequencyHz * 5 -1 then
                        Counter <= 0;
                        State   <= NorthNext;
                    end if;

            end case;

        end if;
    end if;
end process;
end architecture;
