-- EMACS settings: -*-  tab-width: 2; indent-tabs-mode: t -*-
-- vim: tabstop=2:shiftwidth=2:noexpandtab
-- kate: tab-width 2; replace-tabs off; indent-width 2;
-- =============================================================================
-- Authors:				 	Martin Zabel
--									Thomas B. Preusser
--
-- Entity:				 	BCD counter.
--
-- Description:
-- -------------------------------------
-- Counter with output in binary coded decimal (BCD). The number of BCD digits
-- is configurable by ``DIGITS``.
--
-- All control signals (reset ``rst``, increment ``inc``) are high-active and
-- synchronous to clock ``clk``. The output ``val`` is the current counter
-- state. Groups of 4 bit represent one BCD digit. The lowest significant digit
-- is specified by ``val(3 downto 0)``.
--
-- .. TODO::
--
--    * implement a ``dec`` input for decrementing
--    * implement a ``load`` input to load a value
--
-- License:
-- =============================================================================
-- Copyright 2007-2016 Technische Universitaet Dresden - Germany
--										 Chair of VLSI-Design, Diagnostics and Architecture
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--		http://www.apache.org/licenses/LICENSE-2.0
--
--! Unless required by applicable law or agreed to in writing, software
--! distributed under the License is distributed on an 'AS IS' BASIS,
--! WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
--! See the License for the specific language governing permissions and
--! limitations under the License.
-- =============================================================================

library	IEEE;
use			IEEE.std_logic_1164.all;
use			IEEE.numeric_std.all;

library PoC;
use			PoC.utils.all;


entity arith_counter_bcd is
	generic (
		DIGITS : positive														--! Number of BCD digits
	);
	port (
		clk : in	std_logic;
		rst : in	std_logic;												--! Reset to 0
		inc : in	std_logic;												--! Increment
		val : out T_BCD_VECTOR(DIGITS+DIGITS-1 downto 0) 	--! Value output
	);
end entity;

architecture rtl of arith_counter_bcd is

begin

end architecture;
