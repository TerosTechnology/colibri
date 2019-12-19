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
