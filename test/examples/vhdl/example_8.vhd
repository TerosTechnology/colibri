--! @file example_8.vhd
--! @author el3ctrician (elbadriahmad@gmail.com)
--! @brief Some description can be added here
--! also in multi-lines
--! @details Another description can be added here
--! @version 0.1
--! @date 2020-07-10
--! 
--! @copyright  Copyright (c) 2021 by TerosHDL
--!              GNU Public License
--!  This program is free software: you can redistribute it and/or modify
--!  it under the terms of the GNU General Public License as published by
--!  the Free Software Foundation, either version 3 of the License, or
--!  (at your option) any later version.
--!  This program is distributed in the hope that it will be useful,
--!  but WITHOUT ANY WARRANTY; without even the implied warranty of
--!  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
--!  GNU General Public License for more details.
--!  You should have received a copy of the GNU General Public License
--!  along with this program.  If not, see <https://www.gnu.org/licenses/>
--!
--! And more core description can be added here

entity arith_counter_bcd is
	generic (
		DIGITS : positive														--! Number of BCD digits
	);
	port (
    --! system clock
		clk : in	std_logic;
		rst : in	std_logic;												--! Reset to 0
		inc : in	std_logic;												--! Increment
		val : out T_BCD_VECTOR(DIGITS+DIGITS-1 downto 0) 	--! Value output
	);
end entity;

architecture rtl of arith_counter_bcd is

begin

end architecture;