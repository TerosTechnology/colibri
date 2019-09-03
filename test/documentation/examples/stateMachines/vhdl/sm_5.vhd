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
