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
