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
