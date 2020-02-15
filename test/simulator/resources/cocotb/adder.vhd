-- Adder DUT
library ieee ;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity adder is
generic(
    DATA_WIDTH : positive := 20);
port(
  clk : in  std_logic;
  a   : in  std_logic_vector(DATA_WIDTH-1 downto 0);
  b   : in  std_logic_vector(DATA_WIDTH-1 downto 0);
  x   : out std_logic_vector(DATA_WIDTH-1 downto 0)
);
end adder;

architecture rtl of adder is
  signal test : std_logic;
begin

  process(clk) begin
    test <= a(0);
    x <= std_logic_vector(unsigned(a)+unsigned(b));
  end process;

end rtl;
