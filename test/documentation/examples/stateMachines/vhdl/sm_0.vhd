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
