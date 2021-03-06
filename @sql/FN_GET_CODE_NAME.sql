DELIMITER &&
CREATE FUNCTION FN_GET_CODE_NAME(
    P_GROUP VARCHAR(50),
    P_CODE VARCHAR(50)
) RETURNS VARCHAR(10) CHARSET UTF8
BEGIN
    DECLARE RET VARCHAR(100);

    SELECT CODE_NAME INTO RET FROM COMMON_CODE
    WHERE GROUP_CODE=P_GROUP AND CODE = P_CODE;
    RETURN RET;
END &&
DELIMITER ;