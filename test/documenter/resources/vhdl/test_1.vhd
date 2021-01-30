library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

--! module description


entity example is
  port (
    --! clk input
    --! --- clk second line
    clk        : in std_logic;
    signal_in  : in std_logic; --! signal in
    signal_out : out std_logic --! signal out
  );
end entity;
architecture rtl of example is
  type t_state is (state1, state2, state3);
  signal state : t_state;

begin

  stm : process (clk)
  begin
    if rising_edge(clk) then
      case state is
        when state1 =>
          signal_out <= '0';
          if (signal_in = '1') then
            state <= state2;
          end if;
        when state2 =>
          signal_out <= '0';
          if (signal_in = '1') then
            state <= state3;
          end if;
        when state3 =>
          signal_out <= '1';
          if (signal_in = '0') then
            state <= state1;
          end if;
      end case;
    end if;
  end process;

end architecture;