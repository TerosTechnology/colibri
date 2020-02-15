library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity adder_tb is
end;

architecture bench of adder_tb is

  component adder
    generic(DATA_WIDTH : positive := 5);
    port (
      clk : in std_logic;
      a   : in  std_logic_vector(4 downto 0);
      b   : in  std_logic_vector(4 downto 0);
      x   : out std_logic_vector(4 downto 0)
    );
  end component;

  -- clock period
  constant clk_period : time := 5 ns;
  -- Signal ports
  signal clk: std_logic := '0';
  signal a: std_logic_vector(4 downto 0);
  signal b: std_logic_vector(4 downto 0);
  signal x: std_logic_vector(4 downto 0) ;
begin

  uut: adder
    generic map (DATA_WIDTH => 5)
    port map ( clk => clk,
               a  => a,
               b  => b,
               x  => x );

  stimulus: process
  begin
    a <= "00010";
    b <= "00001";

    assert x /= "00011" report "Error in sum" severity FAILURE;
    std.env.finish;
  end process;

  clk_process :process
  begin
    clk <= '1';
    wait for clk_period/2;
    clk <= '0';
    wait for clk_period/2;
  end process;

end;
