DROP FUNCTION FN_NEXT_SERVICE_ID;
DELIMITER &&
CREATE FUNCTION FN_NEXT_SERVICE_ID() RETURNS VARCHAR(10) CHARSET UTF8
BEGIN
DECLARE RET VARCHAR(10);
    SELECT CONCAT('S',LPAD(REPLACE(MAX(ID),'M','')+1,9,'0')) INTO RET FROM SEQUENCE WHERE REMARK='SERVICE';
	UPDATE SEQUENCE AS A, (SELECT ID+1 AS ID, REMARK FROM SEQUENCE WHERE REMARK='SERVICE') AS B SET A.ID = B.ID WHERE A.REMARK= B.REMARK;
RETURN RET;
END &&
DELIMITER ;
