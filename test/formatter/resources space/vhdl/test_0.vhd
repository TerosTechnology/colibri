library	IEEE;
use			IEEE.std_logic_1164.all;
use			IEEE.numeric_std.all;

entity sample is
	generic (
		DIGITS : positive													
	);
	port (
		clk : in	std_logic;
		rst : in	std_logic;											
		inc : in	std_logic;										
		val : out (DIGITS-1 downto 0) 
	);
end entity;

architecture rtl of sample is
  signal p : unsigned(DIGITS-1 downto 0);  
  signal c : unsigned(DIGITS   downto 0);  
begin

	process (sample)
	begin
		
	end process;


end architecture;
