

library	IEEE;
use			IEEE.std_logic_1164.all;
use			IEEE.numeric_std.all;


--! module description

--! {signal: [
--!  {name: 'clk', wave: 'p.....|...'},
--!  {name: 'rst', wave: 'xxx|.=..xx', data: ['rst']},
--!  {},
--!  {name: 'ack', wave: '1.....|01.'}
--! ]}


entity counter is
	generic (
		number : integer														--! Number
	);
	port (
		clk : in	std_logic;
		rst : out	std_logic											
	);
end entity;


architecture rtl of counter is

begin

end architecture;
