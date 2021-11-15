DELIMITER &&
CREATE FUNCTION FN_GET_CODE_VALUE_NAME(
    P_GROUP VARCHAR(50),
    P_VALUE VARCHAR(50)
) RETURNS VARCHAR(10) CHARSET UTF8
BEGIN
    DECLARE RET VARCHAR(100);

    SELECT CODE_NAME INTO RET FROM COMMON_CODE
    WHERE GROUP_CODE=P_GROUP AND VALUE = P_VALUE;
    RETURN RET;
END &&
DELIMITER ;