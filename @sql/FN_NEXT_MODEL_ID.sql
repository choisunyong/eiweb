DROP FUNCTION FN_NEXT_MODEL_ID;
DELIMITER &&
CREATE FUNCTION FN_NEXT_MODEL_ID() RETURNS VARCHAR(10) CHARSET UTF8
BEGIN
DECLARE RET VARCHAR(10);
    SELECT CONCAT('M',LPAD(REPLACE(MAX(ID),'M','')+1,9,'0')) INTO RET FROM SEQUENCE WHERE REMARK='MODEL';
	UPDATE SEQUENCE AS A, (SELECT ID+1 AS ID, REMARK FROM SEQUENCE WHERE REMARK='MODEL') AS B SET A.ID = B.ID WHERE A.REMARK= B.REMARK;
RETURN RET;
END &&
DELIMITER ;
