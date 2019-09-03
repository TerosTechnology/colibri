case r_st_present is
  when ST_ST_GET_PROD_REQ  =>
    w_st_next  <= ST_CHECK_CREDIT;

  when ST_RESET =>
    w_st_next <= ST_CHECK_CREDIT;

  when ST_CHECK_CREDIT     =>
    if (r_price_product_counter>=r_price_product) then
      w_st_next  <= ST_PROVIDE_PRODUCT;
    elsif(i_refund_request='1') then
      w_st_next  <= ST_PROVIDE_TOTAL_REFUND;
    else
      w_st_next  <= ST_CHECK_CREDIT;
    end if;

  when ST_PROVIDE_PRODUCT  =>
    w_st_next  <= ST_PROVIDE_REFUND;

  when ST_PROVIDE_REFUND   =>
    w_st_next  <= ST_RESET;

  when ST_PROVIDE_TOTAL_REFUND   =>
    w_st_next  <= ST_RESET;

  when others=> -- ST_RESET            =>
    if (i_product_sel_valid='1') then
      w_st_next  <= ST_ST_GET_PROD_REQ;
    else
      w_st_next  <= ST_RESET;
    end if;
end case;
end process p_comb;
